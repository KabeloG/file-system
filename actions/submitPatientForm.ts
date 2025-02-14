"use server";

import prisma from "@/lib/prisma";
import { PatientFormData } from "@/lib/schemas";

export async function submitPatientForm(data: PatientFormData) {
  try {
    const { dependants, ...patientData } = data;

    const createdPatient = await prisma.patient.create({
      data: {
        ...patientData,
        dependants: {
          create: dependants?.map((dependant) => ({
            dependantFullName: dependant.dependantFullName,
            dependantGender: dependant.dependantGender,
            dependantDateOfBirth: dependant.dependantDateOfBirth,
          })),
        },
      },
    });

    return createdPatient;
  } catch (error) {
    console.error("Error creating patient:", error);
    throw new Error("Failed to create patient and dependants");
  }
}
