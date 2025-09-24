import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { RealtimeTick, FeatureKey } from '@/types'

export function useRealtime(
  feature: FeatureKey | null,
  enabled: boolean,
  onTick: (tick: RealtimeTick) => void
) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!enabled || !feature) {
      // Disconnect if disabled or no feature selected
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      return
    }

    // Connect to Socket.IO server
    socketRef.current = io()

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('🔌 Connected to real-time server')
      // Subscribe to the specific feature
      socket.emit('subscribe-realtime', { feature })
    })

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from real-time server')
    })

    socket.on('tick', (tick: RealtimeTick) => {
      // Only process ticks for the currently selected feature
      if (tick.feature === feature) {
        onTick(tick)
      }
    })

    return () => {
      if (socket) {
        socket.emit('unsubscribe-realtime', { feature })
        socket.disconnect()
      }
    }
  }, [feature, enabled, onTick])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])
}
