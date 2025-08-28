'use client'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import CodeFlashCard from './_components/CodeFlashCard'
import WordFlashCard from './_components/WordFlashCard'

const FlashCard = () => {
    const [flashCard, setFlashCard] = useState()
    const params = useParams()
    
    React.useEffect(() => {
        const flashcardParam = params.flashcard
        setFlashCard(flashcardParam)
    }, [params])
    
    return (
        <div>
    {flashCard === 'code' ? <CodeFlashCard /> : 
        flashCard === 'word' ? <WordFlashCard /> : 
        <>error 404</>
    }
           
        </div>    )
}

export default FlashCard