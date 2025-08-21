interface EmailOptions {
    email: string;
    subject: string;
    template: string;
    data: any;
}
export declare const sendEmail: (options: EmailOptions) => Promise<void>;
export {};
//# sourceMappingURL=emailService.d.ts.map