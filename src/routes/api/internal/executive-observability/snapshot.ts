import { getExecutiveDashboardApiResponse } from "./-handler";

export async function GET(request: Request) {
  return getExecutiveDashboardApiResponse(request, "snapshot");
}
