"use client"
import { useState, useEffect } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { sections } from "./sections"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { AudioLines, Mic, Repeat } from "lucide-react"
import { useRouter } from "next/navigation"

export function Page() {
  const router = useRouter()
  const [examStarted, setExamStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [repeat, setRepeat] = useState(true)
  const [listening, setListening] = useState(false)
  const [result, setResult] = useState([])
  const [currentSection, setCurrentSection] = useState(0)
  const [questions, setQuestions] = useState(sections[currentSection].questions)

  const [timeLeft, setTimeLeft] = useState(10)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const startTimer = () => {
    setIsActive(true)
  }

  const resetTimer = () => {
    setTimeLeft(questions[currentQuestionIndex]?.time)
    setIsActive(false)
  }

  useEffect(()=>{
    if(timeLeft==0){
      nextQuestion()
    }
  },[timeLeft])

  useEffect(() => {
    if (examStarted && currentQuestionIndex < questions.length) {
      resetTimer()
      const synth = window.speechSynthesis
      const utterThis = new SpeechSynthesisUtterance(
        questions[currentQuestionIndex].text
      )
      utterThis.onend = () => {
        if (questions[currentQuestionIndex]?.type === "voice") {
          startListening()
        }
      }

      synth.speak(utterThis)
      if (questions[currentQuestionIndex]?.time) {
        startTimer()
      }
    }
  }, [examStarted, currentQuestionIndex, repeat, currentSection])

  const startExam = () => {
    setExamStarted(true)
    setResult(sections.map(section => ({ [section.name]: Array(section.questions.length).fill(null) })))
  }

  const nextQuestion = () => {
    updateResult()
    setAnswer("")
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const updateResult = () => {
    setResult(prevResult => {
      const newResult = [...prevResult]
      console.log(result);
      newResult[currentSection][sections[currentSection].name][currentQuestionIndex] = answer || null
      const storedData = localStorage.getItem('SMMSEResult');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        parsedData[currentSection][sections[currentSection].name][currentQuestionIndex] = answer || null;
        localStorage.setItem('SMMSEResult', JSON.stringify(parsedData));
      } else {
        localStorage.setItem('SMMSEResult', JSON.stringify(newResult));
      }
      return newResult
    })
  }

  const EndExam = () => {
    updateResult()
    router.push('/results')
  }

  const nextSection = () => {
    updateResult()
    setCurrentSection(currentSection + 1)
    setQuestions(sections[currentSection + 1].questions)
    setCurrentQuestionIndex(0)
    setAnswer("")
  }

  const startListening = () => {
    console.log("listenring")
    setListening(true)
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = "en-US" 
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      console.log("transcript", transcript)
      setAnswer(transcript)
      setListening(false)
      recognition.stop()
    }
    recognition.onspeechend = () => {
      console.log("Speech ended")
      recognition.stop()
    }

    recognition.onend = () => {
      console.log("Recognition ended")
      setListening(false)
    }

    recognition.onerror = (event) => {
      console.error("Recognition error", event)
      setListening(false)
    }

    recognition.start()
  }

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value)
  }

  return (
    <div className='grid min-h-screen w-full grid-cols-1 bg-background text-foreground md:grid-cols-[300px_1fr]'>
      <div className='flex flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10'>
        <Avatar className='h-24 w-24'>
          <AvatarImage src='/avatar.png' />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-bold'>Virtual SMMSE</h1>
          <p className='text-muted-foreground'>
            Standardized Mini-Mental State Examination
          </p>
        </div>
        {!examStarted ? (
          <Button className='w-full' onClick={startExam}>
            Start Test
          </Button>
        ) : currentQuestionIndex < questions.length - 1 ? (
          <Button className='w-full' onClick={nextQuestion}>
            Next Question
          </Button>
        ) : currentSection < sections.length - 1 ? (
          <Button
            className='w-full'
            onClick={nextSection}>
            Next Section
          </Button>
        ) : (
          <Button className='w-full' onClick={EndExam}>
            End Test
          </Button>
        )}
      </div>
      <main className='flex flex-col items-center justify-center gap-8 p-6 md:p-10'>
        <div className='grid w-full max-w-2xl gap-6'>
          {examStarted ? (
            <>
              {currentQuestionIndex < questions.length && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center justify-between'>
                      <div className='flex gap-3 items-center'>
                        <Badge variant='outline'>
                          section - {currentSection + 1}
                        </Badge>
                        <Badge>{sections[currentSection].name}</Badge>
                      </div>
                      <div className='text-gray-600'>
                        {questions[currentQuestionIndex].time && timeLeft}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h2>
                      <span>{currentQuestionIndex + 1}. </span>
                      {questions[currentQuestionIndex].text}
                    </h2>
                    {questions[currentQuestionIndex]?.image && (
                      <Image
                        src={questions[currentQuestionIndex].image}
                        width={100}
                        height={100}
                      />
                    )}
                    {questions[currentQuestionIndex].type === "voice" ? (
                      <div>
                        <Button
                          onClick={() => setRepeat((prev) => !prev)}
                          variant='ghost'
                          size='icon'>
                          <Repeat className='w-4 h-4' />
                          <span className='sr-only'>Repeat Question</span>
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className={listening && "text-green-500"}>
                      <AudioLines  className='w-4 h-4' />
                          <span className='sr-only'>Listening</span>
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={startListening}
                          disabled={listening}>
                          <Mic className='w-4 h-4' />
                          <span className='sr-only'>Listen</span>
                        </Button>
                        <p>Answer:{answer}</p>
                      </div>
                    ) : (
                      <Textarea
                        value={answer}
                        onChange={handleAnswerChange}
                        placeholder='Your answer'
                        className='mt-4'
                      />
                    )}
                  </CardContent>
                </Card>
              )}
              {currentQuestionIndex >= questions.length && (
                <p>Questionnaire completed!</p>
              )}
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Welcome to the SMMSE Test</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  This is a standardized test to assess cognitive function. The
                  test will take approximately 10 minutes to complete. Please
                  ensure you are in a quiet environment and can focus on the
                  questions.
                </p>
                <p>
                  Press the "Start Test" button when you are ready to begin.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

export default Page
