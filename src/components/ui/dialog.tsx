import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

const DialogPortal = ({ children }: { children: React.ReactNode }) => (
  <DialogPrimitive.Portal>
    <div className="fixed inset-0 z-40 bg-black/60 pointer-events-none transition-opacity data-[state=open]:opacity-100 data-[state=closed]:opacity-0" />
    {children}
  </DialogPrimitive.Portal>
)

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogPrimitive.Content
      ref={ref}
      {...props}
      className={cn(
        "fixed top-1/2 left-1/2 z-50 w-full max-w-lg max-h-[80vh] " +
        "-translate-x-1/2 -translate-y-1/2 overflow-y-auto " +
        "bg-white rounded-lg p-6 flex flex-col gap-4 pointer-events-auto " +
        "shadow-lg",
        className
      )}
    >
      {children}
      <DialogClose className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100">
        <X className="h-4 w-4 text-gray-600" />
      </DialogClose>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-between", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-gray-500", className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex justify-end space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
}
