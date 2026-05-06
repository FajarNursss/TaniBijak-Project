import { useNotification } from '../context/NotificationContext'

export const useNotificationHook = () => {
  return useNotification()
}

export default useNotificationHook
