import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useWeb3Forms from '@web3forms/react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from './ui/sheet';
import { LockInput } from './ui/lock-input';
import { DrawCheckbox } from './ui/draw-checkbox';
import { MorphingButton } from './ui/morphing-button';
import { VelocityToast } from './ui/velocity-toast';
import { WHATSAPP_DISPLAY_NUMBER, getContactPageEnquiryMessage, getWhatsAppUrl } from '../utils/whatsapp';

interface FormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  projectType: string;
  requirement: string;
  message: string;
  consent: boolean;
  botcheck: boolean;
}

const PROJECT_TYPES = [
  'Hotel / Resort',
  'Restaurant / Food Service',
  'Healthcare',
  'Corporate / Commercial',
  'Institution / Education',
  'Wellness & Lifestyle',
  'Other',
];

export interface EnquiryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Global enquiry drawer that reuses the existing web3forms flow.
 *
 * Fields mirror the Contact page form so the submission behaviour is identical,
 * but the inputs use EasyUI LockInput/DrawCheckbox and the submit button uses
 * the MorphingButton states. A VelocityToast confirms the outcome.
 */
export const EnquiryDrawer: React.FC<EnquiryDrawerProps> = ({ open, onOpenChange }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<FormData>({
    mode: 'onTouched',
    defaultValues: {
      projectType: '',
      consent: false,
    },
  });

  const consentValue = watch('consent');
  const whatsappUrl = getWhatsAppUrl(getContactPageEnquiryMessage());

  const [toast, setToast] = useState<{
    open: boolean;
    variant: 'success' | 'error';
    title: string;
    description?: string;
  }>({ open: false, variant: 'success', title: '' });

  const { submit: onSubmit } = useWeb3Forms({
    access_key: '255c983d-a0b4-474e-b591-cd287efa3236',
    settings: {
      from_name: 'Aadi Enterprises Website',
      subject: 'New Inquiry from Website Enquiry Drawer',
    },
    onSuccess: (msg) => {
      setToast({
        open: true,
        variant: 'success',
        title: 'Enquiry sent',
        description: msg || 'Thank you! We will get back to you shortly.',
      });
      reset();
    },
    onError: (msg) => {
      setToast({
        open: true,
        variant: 'error',
        title: 'Could not send enquiry',
        description: msg || 'Please try again or reach us on WhatsApp.',
      });
    },
  });

  const buttonStatus = isSubmitting
    ? 'loading'
    : isSubmitSuccessful
      ? toast.variant === 'success'
        ? 'success'
        : 'error'
      : 'idle';

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="bg-popover text-foreground">
          <SheetHeader>
            <SheetTitle>Request a Quote</SheetTitle>
            <SheetDescription>
              Tell us about your project and we will get back to you. For an
              immediate response, reach us on WhatsApp.
            </SheetDescription>
          </SheetHeader>

          <SheetBody>
            <form
              id="enquiry-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate={false}
            >
              <input
                type="checkbox"
                className="sr-only"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                {...register('botcheck')}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <LockInput
                  label="Name *"
                  placeholder="Your full name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  error={errors.name?.message}
                  {...register('name', {
                    required: 'Name is required',
                    maxLength: { value: 80, message: 'Name is too long' },
                  })}
                />
                <LockInput
                  label="Company / Organization"
                  placeholder="Hotel / Restaurant"
                  autoComplete="organization"
                  {...register('company')}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <LockInput
                  label="Phone *"
                  type="tel"
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  error={errors.phone?.message}
                  {...register('phone', {
                    required: 'Phone number is required',
                  })}
                />
                <LockInput
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  error={errors.email?.message}
                  {...register('email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email',
                    },
                  })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="ed-project-type"
                    className="block select-none text-sm font-medium tracking-tight text-foreground"
                  >
                    Property / Project Type
                  </label>
                  <select
                    id="ed-project-type"
                    {...register('projectType')}
                    className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none transition-colors focus:border-accent-hover"
                  >
                    <option value="">Select a project type</option>
                    {PROJECT_TYPES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <LockInput
                  label="Requirement"
                  placeholder="e.g. Kitchen setup for a new hotel"
                  {...register('requirement')}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="ed-message"
                  className="block select-none text-sm font-medium tracking-tight text-foreground"
                >
                  Message *
                </label>
                <textarea
                  id="ed-message"
                  rows={4}
                  placeholder="Tell us about your requirements…"
                  aria-invalid={!!errors.message}
                  className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent-hover"
                  {...register('message', {
                    required: 'Message is required',
                  })}
                />
                {errors.message && (
                  <span className="text-xs font-medium text-destructive" role="alert">
                    {errors.message.message}
                  </span>
                )}
              </div>

              <DrawCheckbox
                label="I agree to be contacted about my enquiry."
                {...register('consent', {
                  required: 'Please agree to be contacted',
                })}
              />
              {errors.consent && (
                <span className="text-xs font-medium text-destructive" role="alert">
                  {errors.consent.message}
                </span>
              )}
            </form>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <MessageCircle size={15} aria-hidden="true" />
              Chat on WhatsApp ({WHATSAPP_DISPLAY_NUMBER})
            </a>
          </SheetBody>

          <SheetFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              Cancel
            </button>
            <MorphingButton
              type="submit"
              form="enquiry-form"
              status={buttonStatus}
              idleText="Send Enquiry"
              loadingText="Sending…"
              successText="Sent"
              errorText="Failed"
              idleIcon={<ArrowRight size={16} aria-hidden="true" />}
              variant="primary"
              disabled={!consentValue}
            />
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <VelocityToast
        open={toast.open}
        onDismiss={() => setToast((t) => ({ ...t, open: false }))}
        variant={toast.variant}
        title={toast.title}
        description={toast.description}
        position="bottom-right"
      />
    </>
  );
};
