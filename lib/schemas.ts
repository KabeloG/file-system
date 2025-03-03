import { z } from "zod";

export const medicalAidNames = [
  "DISCOVERY",
  "BONITAS",
  "MOMENTUM",
  "MEDIHELP",
  "POLMED",
  "GEMS",
  "BESTMED",
  "PROFMED",
  "SISONKE",
  "CAPE_MEDICAL_PLAN",
  "HOSMED",
  "KEYHEALTH",
  "LA_HEALTH",
  "MEDSHIELD",
  "SPECTRAMED",
  "THEBEMED",
  "FEDHEALTH",
  "GENESIS",
  "NATIONAL_HEALTHCARE_GROUP",
  "OTHER",
] as const;

export const patientSchema = z.object({
  patientFullName: z.string().min(1, "First name is required"),
  patientIdNumber: z.string(),
  paymentType: z.enum(["CASH", "MEDICAL_AID"]),

  homeAddress: z.string().optional(),
  medicalAidHolderFullName: z.string().optional(),
  medicalAidHolderIdNumber: z.string().optional(),
  medicalAidHolderPhone: z.string().optional(),
  medicalAidHolderSecondPhone: z.string().optional(),
  medicalAidName: z.enum([...medicalAidNames]).optional(),
  medicalAidNumber: z.string().optional(),
  medicalAidPlan: z.string().optional(),

  dependants: z
    .array(
      z.object({
        dependantFullName: z.string().optional().default(""),
        dependantGender: z.enum(["MALE", "FEMALE"]).optional(),
        dependantDateOfBirth: z.string().optional().default(""),
      })
    )
    .optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

export type PatientFormData = z.infer<typeof patientSchema>;
