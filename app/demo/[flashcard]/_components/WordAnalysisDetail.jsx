
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReadingAnalysisVisualization({ para, wordGazeData }) {
  const words = useMemo(() => {
    return para
      .split(/\s+/)
      .map((word) => word.replace(/[.,]/g, "").toLowerCase());
  }, [para]);

  // Enhanced wordStats with coordinate tracking
  const wordStats = useMemo(() => {
    const stats = words.map((word) => ({
      word,
      clean: word.toLowerCase(),
      read: false,
      visits: 0,
      duration: 0,
      // Track all visits with timestamps and durations
      visitDetails: [],
      // Track coordinates for each visit
      coordinates: []
    }));

    // Sort the gaze data by timestamp to ensure chronological order
    const sortedGazeData = [...wordGazeData].sort((a, b) => a.timestamp - b.timestamp);

    sortedGazeData.forEach((data) => {
      const cleanWord = data.word.toLowerCase().replace(/[.,]/g, "");
      const stat = stats.find((w) => w.clean === cleanWord);
      if (stat) {
        stat.read = true;
        stat.visits += 1;
        stat.duration += data.duration;
        
        // Store visit details
        stat.visitDetails.push({
          timestamp: data.timestamp,
          duration: data.duration
        });
        
        // Store coordinates
        stat.coordinates.push({
          x: data.x_coordinate,
          y: data.y_coordinate
        });
      }
    });

    return stats;
  }, [words, wordGazeData]);

  // Function to check if coordinates are very close (suggesting same reading position)
  const areCoordinatesClose = (coord1, coord2, threshold = 30) => {
    if (!coord1 || !coord2) return false;
    const xDiff = Math.abs(coord1.x - coord2.x);
    const yDiff = Math.abs(coord1.y - coord2.y);
    return xDiff < threshold && yDiff < threshold;
  };

  // Refined analysis with improved metrics
  const summary = useMemo(() => {
    const totalWords = words.length;
    const wordsRead = wordStats.filter((w) => w.read).length;
    const totalDuration = wordStats.reduce((sum, w) => sum + w.duration, 0);
    const totalDurationSec = totalDuration / 1000;
    const avgDurationPerWord =
      wordsRead > 0 ? Math.round(totalDuration / wordsRead) : 0;
    const wpm =
      totalDurationSec > 0 ? Math.round((wordsRead / totalDurationSec) * 60) : 0;

    // Detect focus words where any single visit duration was > 500ms
    const focusWords = new Set(
      wordStats
        .filter((w) => w.visitDetails.some(visit => visit.duration > 500))
        .map((w) => w.word)
    );

    // Detect re-reads accounting for coordinate proximity
    const reReads = new Set(
      wordStats
        .filter((w) => {
          // Consider re-read only if coordinates are significantly different
          if (w.visits <= 1) return false;
          
          // Check if any pair of coordinates are far apart enough
          for (let i = 0; i < w.coordinates.length; i++) {
            for (let j = i + 1; j < w.coordinates.length; j++) {
              if (!areCoordinatesClose(w.coordinates[i], w.coordinates[j])) {
                return true;
              }
            }
          }
          return false; // If all coordinates are close, it's not a true re-read
        })
        .map((w) => w.word)
    );

    // Detect difficult words where any single visit duration was > 1500ms
    const difficultWords = wordStats
      .filter((w) => w.visitDetails.some(visit => visit.duration > 1500))
      .map((w) => w.word);

    // Get unique skipped words (no repetitions)
    const skippedWords = [...new Set(
      wordStats
        .filter((w) => !w.read)
        .map((w) => w.clean)
    )];

    const wordOrder = wordGazeData.map((d) =>
      d.word.toLowerCase().replace(/[.,]/g, "")
    );
    
    const isLinear = wordOrder.every(
      (w, i) => i === 0 || w === words[i]?.replace(/[.,]/g, "").toLowerCase()
    );

    const readingScore = Math.round((wordsRead / totalWords) * 100);

    return {
      total_words: totalWords,
      words_read: wordsRead,
      words_skipped: totalWords - wordsRead,
      unique_words_skipped: skippedWords.length,
      avg_duration_per_word: avgDurationPerWord,
      total_duration_spent_sec: +totalDurationSec.toFixed(2),
      words_per_minute: wpm,
      avg_wpm_benchmark: 200,
      reading_score: readingScore,
      focused_words: Array.from(focusWords),
      re_reads: Array.from(reReads),
      difficult_words: difficultWords,
      skipped_words: skippedWords,
      reading_flow: isLinear ? "linear" : "non-linear",
      is_reading_properly: readingScore > 70 && wpm >= 120,
    };
  }, [wordStats, wordGazeData, words]);

  // Function to determine intensity of color based on duration metrics
  const getHeatColor = (word) => {
    const stat = wordStats.find((w) => w.word === word);
    if (!stat || !stat.read) return "bg-gray-100 text-gray-400";
    
    // Check if any single visit was very long (difficult word)
    if (stat.visitDetails.some(visit => visit.duration > 1500)) 
      return "bg-red-600 text-white";
    
    // Check if any single visit was moderately long
    if (stat.visitDetails.some(visit => visit.duration > 1000))
      return "bg-red-400 text-white";
    
    // Check if any single visit showed focused attention
    if (stat.visitDetails.some(visit => visit.duration > 500))
      return "bg-orange-400 text-white";
    
    // Shorter focus durations
    if (stat.visitDetails.some(visit => visit.duration > 300))
      return "bg-yellow-300";
    
    return "bg-green-300";
  };

  // Function to get visit count indicator (only for true re-reads with different coordinates)
  const getVisitBadge = (word) => {
    const stat = wordStats.find((w) => w.word === word);
    if (!stat) return null;
    
    // Count distinct viewing positions (not just visits)
    let uniquePositions = 0;
    const positions = [];
    
    for (const coord of stat.coordinates) {
      // Check if this position is distinct from all previous positions
      let isDistinct = true;
      for (const existingPos of positions) {
        if (areCoordinatesClose(coord, existingPos)) {
          isDistinct = false;
          break;
        }
      }
      if (isDistinct) {
        uniquePositions++;
        positions.push(coord);
      }
    }
    
    if (uniquePositions <= 1) return null;
    
    return (
      <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
        {uniquePositions}
      </span>
    );
  };

  // Split paragraph into words for heatmap
  const paragraphWords = useMemo(() => {
    return para.split(/(\s+)/).filter(Boolean);
  }, [para]);

  return (
    <div className="space-y-6">
      {/* Reading Metrics Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Reading Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Reading Score */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">
                  {summary.reading_score}%
                </span>
                <span className="text-gray-500 text-sm mb-1">
                  Reading Score
                </span>
              </div>
              <div className="mt-2 text-sm">
                {summary.is_reading_properly ? (
                  <span className="text-green-600">Good reading pattern</span>
                ) : (
                  <span className="text-red-600">Needs improvement</span>
                )}
              </div>
            </div>
            
            {/* Reading Speed */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{summary.words_per_minute}</span>
                <span className="text-gray-500 text-sm mb-1">WPM</span>
              </div>
              <div className="mt-2 text-sm">
                {summary.words_per_minute >= summary.avg_wpm_benchmark ? (
                  <span className="text-green-600">Above average speed</span>
                ) : (
                  <span className="text-orange-600">Below average speed</span>
                )}
              </div>
            </div>
            
            {/* Word Coverage */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">
                  {summary.words_read}/{summary.total_words}
                </span>
                <span className="text-gray-500 text-sm mb-1">Words Read</span>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-blue-600">
                  {summary.unique_words_skipped} unique words skipped
                </span>
              </div>
            </div>
          </div>
          
          {/* Reading Flow */}
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Reading Flow:</span>
              <span className={`px-2 py-1 rounded ${
                summary.reading_flow === "linear" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-orange-100 text-orange-800"
              }`}>
                {summary.reading_flow === "linear" ? "Linear (Good)" : "Non-linear (Jumpy)"}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {summary.reading_flow === "linear" 
                ? "Reading in proper sequence from start to end" 
                : "Jumping between words or sections"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Heatmap Visualization */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Text Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex flex-wrap gap-1">
              {paragraphWords.map((word, index) => (
                word.trim() ? (
                  <div className="relative" key={`${word}-${index}`}>
                    <span className={`inline-block px-1 py-0.5 rounded ${getHeatColor(word.replace(/[.,]/g, ""))}`}>
                      {word}
                    </span>
                    {getVisitBadge(word.replace(/[.,]/g, ""))}
                  </div>
                ) : (
                  <span key={`space-${index}`}>{word}</span>
                )
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-100 mr-1"></div>
                <span>Not read</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-300 mr-1"></div>
                <span>&lt;300ms</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-300 mr-1"></div>
                <span>300-500ms</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-400 mr-1"></div>
                <span>500-1000ms</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-400 mr-1"></div>
                <span>1000-1500ms</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-600 mr-1"></div>
                <span>&gt;1500ms (Difficult)</span>
              </div>
              <div className="flex items-center ml-4">
                <div className="relative">
                  <span className="inline-block px-1 bg-green-300 rounded">word</span>
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                    2
                  </span>
                </div>
                <span className="ml-1">Multiple distinct views</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Insights */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Reading Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Focus Words */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Focus Words</h3>
              <div className="flex flex-wrap gap-1">
                {summary.focused_words.length > 0 ? (
                  summary.focused_words.map((word, idx) => (
                    <span 
                      key={idx} 
                      className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-sm"
                    >
                      {word}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No focus words detected</span>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Words with any single gaze duration &gt;500ms
              </div>
            </div>
            
            {/* Difficult Words */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Difficult Words</h3>
              <div className="flex flex-wrap gap-1">
                {summary.difficult_words.length > 0 ? (
                  summary.difficult_words.map((word, idx) => (
                    <span 
                      key={idx} 
                      className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-sm"
                    >
                      {word}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No difficult words detected</span>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Words with any single gaze duration &gt;1500ms
              </div>
            </div>
            
            {/* Skipped Words */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Skipped Words</h3>
              <div className="flex flex-wrap gap-1">
                {summary.skipped_words.length > 0 ? (
                  summary.skipped_words.map((word, idx) => (
                    <span 
                      key={idx} 
                      className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-sm"
                    >
                      {word}
                    </span>
                  ))
                ) : (
                  <span className="text-green-600 text-sm">No words skipped - Great!</span>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Unique words that were not looked at
              </div>
            </div>
            
            {/* Re-read Words */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Re-read Words</h3>
              <div className="flex flex-wrap gap-1">
                {summary.re_reads.length > 0 ? (
                  summary.re_reads.map((word, idx) => (
                    <span 
                      key={idx} 
                      className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm"
                    >
                      {word}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No re-reads detected</span>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Words read multiple times from significantly different positions
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raw Data */}
      <Card className="pb-20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Raw Analysis Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-xs max-h-64">
            {JSON.stringify(summary, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}