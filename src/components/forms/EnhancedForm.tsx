'use client';

import React, { ReactNode } from 'react';
import { useForm, UseFormProps, FieldValues, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from '@/lib/mock-framer-motion';
import { cn } from '@/lib/utils';

interface EnhancedFormProps {
  children: ReactNode;
  onSubmit: SubmitHandler<any>;
  schema: z.ZodSchema<any>;
  className?: string;
  isLoading?: boolean;
  loadingText?: string;
  defaultValues?: any;
}

export function EnhancedForm({
  children,
  onSubmit,
  schema,
  className,
  isLoading = false,
  loadingText = '提交中...',
  defaultValues,
  ...formProps
}: EnhancedFormProps) {
  const form = useForm({
    resolver: zodResolver(schema as any),
    defaultValues,
    ...formProps,
  });

  const { handleSubmit, formState: { errors, isSubmitting } } = form;

  const showLoading = isLoading || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-6', className)}
      noValidate
    >
      <FormProvider form={form}>
        <fieldset disabled={showLoading} className="space-y-6">
          {children}
        </fieldset>
        
        <AnimatePresence>
          {showLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center space-x-2 py-4"
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-muted-foreground">{loadingText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </FormProvider>
    </form>
  );
}

// Form Context for field components
const FormContext = React.createContext<any>(null);

interface FormProviderProps {
  form: any;
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ form, children }) => {
  return (
    <FormContext.Provider value={form}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export default EnhancedForm;