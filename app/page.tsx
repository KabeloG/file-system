"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  medicalAidNames,
  patientSchema,
  PatientFormValues,
} from "@/lib/schemas";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { submitPatientForm } from "@/actions/submitPatientForm";

export default function Page() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDependants, setHasDependants] = useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      patientFullName: "",
      patientIdNumber: "",
      paymentType: "MEDICAL_AID",
      homeAddress: "",
      medicalAidName: "GEMS",
      medicalAidHolderFullName: "",
      medicalAidHolderIdNumber: "",
      medicalAidHolderPhone: "",
      medicalAidHolderSecondPhone: "",
      medicalAidNumber: "",
      medicalAidPlan: "",
      dependants: [
        {
          dependantFullName: "",
          dependantGender: "MALE",
          dependantDateOfBirth: "",
        },
      ],
    },
  });

  const { control, handleSubmit, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dependants",
  });

  const paymentType = watch("paymentType");

  useEffect(() => {
    if (paymentType === "CASH") {
      form.setValue("medicalAidName", undefined);
      form.setValue("medicalAidHolderFullName", undefined);
      form.setValue("medicalAidHolderIdNumber", undefined);
      form.setValue("medicalAidHolderPhone", undefined);
      form.setValue("medicalAidHolderSecondPhone", undefined);
      form.setValue("homeAddress", undefined);
      form.setValue("medicalAidNumber", undefined);
      form.setValue("medicalAidPlan", undefined);
      form.setValue("dependants", []);
    }
  }, [paymentType, form]);

  async function onSubmit(data: PatientFormValues) {
    try {
      setIsSubmitting(true);

      if (!hasDependants) {
        data.dependants = [];
      }

      await submitPatientForm(data);

      toast({
        title: "Data sent",
      });
    } catch (error) {
      setIsSubmitting(false);

      toast({
        title: "Error sending data",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <h1 className="text-2xl mb-10">Patient File System</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Patient Details */}
        <FormField
          control={control}
          name="patientFullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Full Name (Required)</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="patientIdNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient ID Number (Required)</FormLabel>
              <FormControl>
                <Input placeholder="Enter patient ID number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cash / Medical Aid</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Medical Aid" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="MEDICAL_AID">Medical Aid</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {paymentType === "MEDICAL_AID" && (
          <>
            <FormField
              control={control}
              name="medicalAidHolderFullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Aid Holder Full Name (Required)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter holder full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="medicalAidHolderPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Medical Aid Holder Phone Number (Required)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter holder phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="medicalAidHolderSecondPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Aid Holder Alt. Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter holder alternative phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="medicalAidHolderIdNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Aid Holder ID Number (Required)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter holder ID number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="homeAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Aid Holder Address (Required)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter full address (e.g. 123 Main St, Apartment Blake, Waterkloof, Pretoria, 0000)"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="medicalAidName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Aid Name</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Medical Aid Name" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicalAidNames.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name.replace(/_/g, " ")}{" "}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="medicalAidNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Aid Number (Required)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter medical aid number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="medicalAidPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Aid Plan</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter medical aid plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={hasDependants}
                onCheckedChange={() => setHasDependants(!hasDependants)}
              />
              <label>Do you have dependants?</label>
            </div>

            {hasDependants && (
              <>
                {/* Dependants */}
                <div>
                  <h3>Dependants</h3>
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-2">
                      <FormField
                        control={control}
                        name={`dependants.${index}.dependantFullName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Dependant Full Name (Required)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter dependant full name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`dependants.${index}.dependantGender`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dependant Gender (Required)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select dependant gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`dependants.${index}.dependantDateOfBirth`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Dependant Date of Birth (Required)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                placeholder="Enter dependant date of birth"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="button" onClick={() => remove(index)}>
                        Remove Dependant
                      </Button>
                    </div>
                  ))}

                  <Button
                    className="mt-10"
                    type="button"
                    onClick={() => {
                      append({
                        dependantFullName: "",
                        dependantGender: "MALE",
                        dependantDateOfBirth: "",
                      });
                    }}
                  >
                    Add Dependant
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        <Button type="submit">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
