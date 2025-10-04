import { getUserAvailability } from "@/actions/availability"
import { defaultAvailability } from "./data";
import AvailabilityForm from "./_components/availability-form";

export default async function AvailabilityPage() {
  const availability = await getUserAvailability();
  console.log("availability", availability);
  return <AvailabilityForm initialData={availability || defaultAvailability} />
}