"use client";

import { Arrangement, CreateArrangementBody, GetArrangementsSearchParams, UpdateArrangementBody } from "./types/arrangements";

export async function createArrangement(arrangementData: CreateArrangementBody): Promise<Arrangement> {
  const response = await fetch("/api/arrangements", {
    method: "POST",
    body: JSON.stringify(arrangementData),
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to create arrangement");
  }

  return (await response.json()) as Arrangement;
}

export async function getArrangements(searchParams: GetArrangementsSearchParams): Promise<Arrangement[]> {
  const queryString = new URLSearchParams(searchParams as any).toString();
  const response = await fetch(`/api/arrangements?${queryString}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch arrangements", {
      cause: response
    });
  }

  return (await response.json()) as Arrangement[];
}

export async function getArrangement(arrangementId: string): Promise<Arrangement> {
  const response = await fetch(`/api/arrangements/${arrangementId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch arrangement", {
      cause: response
    });
  }

  return (await response.json()) as Arrangement;
}

export async function updateArrangement(arrangementId: string, arrangementData: UpdateArrangementBody): Promise<Arrangement> {
  const response = await fetch(`/api/arrangements/${arrangementId}`, {
    method: "PATCH",
    body: JSON.stringify(arrangementData),
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to update arrangement", {
      cause: response
    });
  }

  return (await response.json()) as Arrangement;
}

export async function deleteArrangement(arrangementId: string): Promise<Arrangement> {
  const response = await fetch(`/api/arrangements/${arrangementId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to delete arrangement", {
      cause: response
    });
  }

  return (await response.json()) as Arrangement;
}
