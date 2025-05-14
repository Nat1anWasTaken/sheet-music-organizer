import { CreatePartBody, Part, UpdatePartBody } from "./types/parts";

export async function createPart(partData: CreatePartBody): Promise<Part> {
  const response = await fetch("/api/arrangements/[arrangementId]/parts", {
    method: "POST",
    body: JSON.stringify(partData),
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to create part", {
      cause: response
    });
  }

  return (await response.json()) as Part;
}

export async function getParts(searchParams?: GetPartsSearchParams): Promise<Part[]> {
  const queryString = new URLSearchParams(searchParams as any).toString();
  const response = await fetch(`/api/arrangements/[arrangementId]/parts?${queryString}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch parts", {
      cause: response
    });
  }

  return (await response.json()) as Part[];
}

export async function getPart(partId: string): Promise<Part> {
  const response = await fetch(`/api/arrangements/[arrangementId]/parts/${partId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch part", {
      cause: response
    });
  }

  return (await response.json()) as Part;
}

export async function updatePart(partId: string, partData: UpdatePartBody): Promise<Part> {
  const response = await fetch(`/api/arrangements/[arrangementId]/parts/${partId}`, {
    method: "PATCH",
    body: JSON.stringify(partData),
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to update part", {
      cause: response
    });
  }

  return (await response.json()) as Part;
}

export async function deletePart(partId: string): Promise<Part> {
  const response = await fetch(`/api/arrangements/[arrangementId]/parts/${partId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to delete part", {
      cause: response
    });
  }

  return (await response.json()) as Part;
}
