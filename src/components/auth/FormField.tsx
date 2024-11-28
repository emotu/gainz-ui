// New reusable form field component
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export function FormField({ label, error, ...props }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={props.id} className="sr-only">
        {label}
      </label>
      <Input
        {...props}
        className="relative block w-full h-10 focus:z-10 focus:border-black focus:ring-2 focus:ring-black sm:text-sm sm:leading-6"
      />
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
} 