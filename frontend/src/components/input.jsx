import { Controller, useFormContext } from 'react-hook-form';

const Input = ({ label, name = '', startAdornment = null, endAdornment = null, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="form-control">
          {label && (
            <label className="label mb-2">
              <span className={`label-text font-medium ${error && 'text-red-600'}`}>{label}</span>
            </label>
          )}
          <div className="relative">
            {startAdornment && <div className="absolute top-2.5 left-0 z-1 px-3">{startAdornment}</div>}

            <input
              {...field}
              className={`input input-bordered w-full ${startAdornment && 'pl-12'} ${endAdornment && 'pr-12'} ${error && 'input-error'}`}
              {...props}
            />

            {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
            {props.helperText && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{props.helperText}</p>}

            {endAdornment && <div className="absolute top-1 right-0 z-1 px-3">{endAdornment}</div>}
          </div>
        </div>
      )}
    />
  );
};

export default Input;
