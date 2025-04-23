import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface BaseFormModalProps<T extends z.ZodType> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (values: z.infer<T>) => Promise<void>;
  submitText?: string;
  cancelText?: string;
  children: (methods: UseFormReturn<z.infer<T>>) => ReactNode;
  isLoading?: boolean;
}

export function BaseFormModal<T extends z.ZodType>({
  isOpen,
  onClose,
  title,
  description = "",
  schema,
  defaultValues,
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  children,
  isLoading = false,
}: BaseFormModalProps<T>) {
  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogClose className="absolute right-4 top-4" />
        </DialogHeader>
        {description && (
          <DialogDescription>{description}</DialogDescription>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {children(methods)}
          </form>
        </FormProvider>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !methods.formState.isValid}
          >
            {submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
