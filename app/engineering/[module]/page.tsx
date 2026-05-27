import { permanentRedirect } from "next/navigation";

export default async function EngineeringModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params;
  permanentRedirect(`/omnis/${moduleId}`);
}
