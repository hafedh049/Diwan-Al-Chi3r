type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const toast = (props: ToastProps) => {
  // In a real implementation, this would show a toast notification
  console.log("TOAST:", props.title, props.description)

  // For now, we'll just use browser alerts for simplicity
  if (typeof window !== "undefined") {
    alert(`${props.title || ""}\n${props.description || ""}`)
  }

  return {
    id: Date.now(),
    dismiss: () => {},
  }
}

