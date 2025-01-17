import { FunctionComponent } from 'react'
import { useStore } from '@nanostores/react'
import { toastStore } from './toastStore'
import { ToastTimer } from './ToastTimer'

export const ToastContainer: FunctionComponent = () => {
  const toasts = useStore(toastStore)

  if (!toasts.length) {
    return null
  }

  return (
    <div className="z-toast fixed bottom-6 right-6 flex flex-col items-end">
      {toasts.map((toast, index) => (
        <ToastTimer toast={toast} index={index} key={toast.id} />
      ))}
    </div>
  )
}
