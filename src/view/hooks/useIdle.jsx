import { useIdleTimer } from "react-idle-timer"
import { useState } from "react"

export const useIdleTimeout = ({ onIdle = () => {}, idleTime = 1}) => {

    const idleTimeout = idleTime
    const [isIdle, setIsIdle] = useState(false)

    const handleIdle = () => {
        setIsIdle(true)
        onIdle()
    }

    const idleTimer = useIdleTimer({
        timeout: idleTimeout,
        onPrompt: onIdle,
        onIdle: handleIdle,
        debounce: 500
    })

    return {
        isIdle, setIsIdle, idleTimer
    }
}