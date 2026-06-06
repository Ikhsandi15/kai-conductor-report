import { getTrains } from "@/actions/train";
import { TrainClient } from "./TrainClient";

export default async function TrainsPage() {
  const trains = await getTrains();
  
  return (
    <div className="container mx-auto py-10 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Master Data Kereta</h1>
      <TrainClient initialTrains={trains} />
    </div>
  );
}
