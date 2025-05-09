import { ChangeEvent, useState } from "react";

export interface FormContent {
  title: string;
  composers: string;
  arrangementType: string;
}

export type FormContentKey = keyof FormContent;

export interface UseMetadataFormReturn {
  formContent: FormContent;
  setFormContent: React.Dispatch<React.SetStateAction<FormContent>>;
  handleInputChange: (name: FormContentKey) => (e: ChangeEvent<HTMLInputElement>) => void;
}

export function useMetadataForm(): UseMetadataFormReturn {
  const [formContent, setFormContent] = useState<FormContent>({
    title: "",
    composers: "",
    arrangementType: ""
  });

  function handleInputChange(name: FormContentKey) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setFormContent(
        (prev): FormContent => ({
          ...prev,
          [name]: e.target.value
        })
      );
    };
  }

  return { formContent, setFormContent, handleInputChange };
}
