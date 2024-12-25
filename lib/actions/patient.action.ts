'use server';

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )
        return newUser
    } catch (error: any) {
        if (error && error?.code === 409) {
            const documents = await users.list(
                [Query.equal('email', [user.email])]
            )
            return documents?.users[0]
        }
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId)
        return parseStringify(user)
    } catch (error) {
        console.error(error)
    }
}

export const registerPatient = async ({ identificationDocument, user, ...patient }: RegisterUserParams) => {
    try {
        let file;
        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            );
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
        }

        if (!user) {
            throw new Error("Missing required attribute: user is undefined or null");
        }

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: file
                    ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`
                    : null,
                ...patient, // Spread other patient data, excluding userId
                userId: user, // Map the user field to userId
            }
        );

        return parseStringify(newPatient);
    } catch (error) {
        console.error("Error in registerPatient:", JSON.stringify(error, null, 2));
    }
};
