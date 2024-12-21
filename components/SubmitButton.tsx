import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

interface ButtonProps {
    isLoading: boolean;
    className?: string;
    children: React.ReactNode;
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
    return (
        <Button
            type="submit"
            className={className ?? "shad-primary-btn w-full"}
            disabled={isLoading}
        >
            {isLoading ? (
                <div className="flex gap-4 items-center">
                    <Image
                        src="/assets/icons/loader.svg"
                        alt="loader"
                        width={24}
                        height={24}
                        className="animate-spin"
                    />
                    Loading ...
                </div>
            ) : (
                children
            )}
        </Button>
    );
};

export default SubmitButton;