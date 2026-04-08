import { put, del, head } from "@vercel/blob";

// Blob paths for JSON data
const EMPLOYEES_KEY = "data/employees.json";
const AUTH_KEY = "data/auth.json";
const EVENTS_KEY = "data/events.json";

export const storagePaths = {
  employees: EMPLOYEES_KEY,
  auth: AUTH_KEY,
  events: EVENTS_KEY,
};

// Default employee data (used as seed when no blob exists yet)
const defaultEmployees = [
  {
    slug: "andreas-franke",
    name: "Andreas Franke",
    role: "Geschäftsführer",
    phone: "+49 231 123456",
    email: "a.franke@mpool-consulting.de",
    linkedin: "https://www.linkedin.com/in/andreas-franke-1643b6234/",
    website: "https://www.mpool-consulting-do.de",
    photo: "/photos/andreas-franke-1774349094214.jpg",
    design: "classic",
    customDesign: {
      primaryColor: "#111827",
      accentColor: "#0057B8",
      bgColor: "#f8fafc",
      cardBg: "#ffffff",
      textColor: "#111827",
      subtextColor: "#6b7280",
      headerStyle: "gradient",
      layout: "center",
      fontStyle: "sans",
      borderRadius: "md",
      iconStyle: "square",
    },
  },
  {
    slug: "sif-eddine",
    name: "Sif-eddine Khayati",
    role: "IT Werkstudent",
    phone: "017630784792",
    email: "s.khayati@mpool-consulting.de",
    linkedin: "https://www.linkedin.com/in/sif-eddine-khayati-4a39b7255/",
    website: "https://www.mpool-consulting-do.de",
    photo: "/photos/sif-eddine-1774349284620.jpg",
    design: "classic",
  },
  {
    slug: "liubov-timoshok",
    name: "Liubov Timoshok",
    role: "Project management Werkstudentin",
    phone: "",
    email: "l.timoshok@mpool-consulting.de",
    linkedin: "https://www.linkedin.com/in/liubov-timoshok/",
    website: "https://www.mpool-consulting-do.de",
    photo: "/photos/liubov-timoshok-1774349314194.jpg",
    design: "classic",
  },
  {
    slug: "annika-menne",
    name: "Annika Menne",
    role: "Consultant",
    phone: "",
    email: "a.menne@mpool-consulting.de",
    linkedin: "https://www.linkedin.com/in/annika-menne-4570b4325/",
    website: "https://www.mpool-consulting-do.de",
    photo: "",
  },
  {
    slug: "daniela-bristot",
    name: "Daniela Bristot",
    role: "Senior Consultant",
    phone: "  +49 231 546 649 22 |  +49 176 845 351 45",
    email: "d.bristot@mpool-consulting.de",
    linkedin: "https://www.linkedin.com/in/danielabristot/",
    website: "https://www.mpool-consulting-do.de",
    photo: "/photos/daniela-bristot-1774349390146.jpg",
    design: "classic",
  },
  {
    slug: "anne-henter",
    name: "Anne Henter",
    role: "Junior Consultant",
    phone: "0231 546 649 23  | 0171 554 996-2",
    email: "a.henter@mpool-consulting.de",
    linkedin: "https://www.linkedin.com/in/anne-henter/",
    website: "https://www.mpool-consulting-do.de",
    photo: "/photos/anne-henter-1774349460214.jpg",
    design: "classic",
  },
  {
    slug: "bodo-fink",
    name: "Bodo Fink",
    role: "Geschäftsführer",
    phone: "+49 231 2202 9939   |   +49 171 7650112",
    email: "b.fink@mpool-consulting.de",
    linkedin: "https://www.linkedin.com/in/bodo-fink/",
    website: "https://www.mpool-consulting-do.de",
    photo: "/photos/bodo-fink-1774349493824.jpg",
    design: "classic",
  },
  {
    slug: "ansgar-rahmacher",
    name: "Ansgar Rahmacher",
    role: "Multimedia Consultant",
    phone: "+49 231 220 299 34 | +49 176 413 127 36",
    email: "a.rahmacher@mpool-consulting.de",
    linkedin: "https://www.linkedin.com/in/ansgar-rahmacher-61b4382a0/",
    website: "https://www.mpool-consulting-do.de",
    photo: "/photos/ansgar-rahmacher-1774349526976.jpg",
    design: "classic",
  },
];

export async function readJson<T>(blobKey: string, defaultValue: T): Promise<T> {
  try {
    const blob = await head(blobKey, { token: process.env.BLOB_READ_WRITE_TOKEN });
    if (!blob) return defaultValue;
    const response = await fetch(blob.url);
    if (!response.ok) return defaultValue;
    return (await response.json()) as T;
  } catch {
    return defaultValue;
  }
}

export async function writeJson(blobKey: string, data: unknown): Promise<void> {
  await put(blobKey, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

export async function readEmployeesWithDefault<T>(defaultValue: T): Promise<T> {
  const result = await readJson<T>(EMPLOYEES_KEY, defaultValue);
  // If empty array, seed with defaults
  if (Array.isArray(result) && result.length === 0 && Array.isArray(defaultValue) && defaultValue.length === 0) {
    // Check if we should seed
    try {
      await head(EMPLOYEES_KEY, { token: process.env.BLOB_READ_WRITE_TOKEN });
      return result; // blob exists but is empty array, respect it
    } catch {
      // Blob doesn't exist, seed with defaults
      await writeJson(EMPLOYEES_KEY, defaultEmployees);
      return defaultEmployees as unknown as T;
    }
  }
  return result;
}

export async function uploadPhoto(
  filename: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  const blob = await put(`photos/${filename}`, data, {
    access: "public",
    addRandomSuffix: false,
    contentType,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url;
}

export async function getPhotoUrl(filename: string): Promise<string | null> {
  try {
    const blob = await head(`photos/${filename}`, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  } catch {
    return null;
  }
}

export async function deleteBlob(url: string): Promise<void> {
  try {
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch {
    // ignore delete errors
  }
}
