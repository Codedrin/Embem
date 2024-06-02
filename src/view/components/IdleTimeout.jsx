import { useEffect, useState } from "react"

export const useTimeout = (timeoutInSec, onTimeout) => {

    const REACTIVE_MESSAGE = `ACTIVE AGAIN AT ${new Date().getTime()}`
    const INACTIVE_MESSAGE = `INACTIVE AT ${new Date().getTime()}`

    const [idleTimer, setIdleTimer] = useState(null)
    const [isIdle, setIsIdle] = useState(false)

    useEffect(() => {
        const resetTimer = () => {
            clearTimeout(idleTimer)
            const newIdleTimer = setTimeout(() => {
                console.info(INACTIVE_MESSAGE)
                onTimeout()
            }, timeoutInSec * 1000)
            setIdleTimer(newIdleTimer)
        }

        const onActivity = () => {
            console.info(REACTIVE_MESSAGE)
            resetTimer()
        }

        document.addEventListener('mousemove', onActivity)
        document.addEventListener('keypress', onActivity)

        resetTimer()

        return () => {
            document.removeEventListener('mouseMove', onActivity)
            document.removeEventListener('keypress', onActivity)
            clearTimeout(idleTimer)
        }
    }, [timeoutInSec, onTimeout])

    return [isIdle]
}