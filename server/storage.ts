import { VerificationSubmission, InsertVerificationSubmission, EmailReceiverList, InsertEmailReceiver } from "../shared/schema";

export interface IStorage {
  // Verification submissions
  createVerificationSubmission(submission: InsertVerificationSubmission): Promise<VerificationSubmission>;
  getVerificationSubmission(id: string): Promise<VerificationSubmission | null>;
  updateVerificationSubmission(id: string, updates: Partial<VerificationSubmission>): Promise<VerificationSubmission>;
  listVerificationSubmissions(): Promise<VerificationSubmission[]>;
  deleteVerificationSubmission(id: string): Promise<boolean>;
  
  // Email receivers
  createEmailReceiver(receiver: InsertEmailReceiver): Promise<EmailReceiverList>;
  getEmailReceiver(id: string): Promise<EmailReceiverList | null>;
  listEmailReceivers(): Promise<EmailReceiverList[]>;
  deleteEmailReceiver(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private verificationSubmissions: VerificationSubmission[] = [];
  private emailReceivers: EmailReceiverList[] = [];
  private nextId = 1;
  private nextEmailId = 1;

  async createVerificationSubmission(submission: InsertVerificationSubmission): Promise<VerificationSubmission> {
    const newSubmission: VerificationSubmission = {
      id: this.nextId.toString(),
      ...submission,
    };
    this.verificationSubmissions.push(newSubmission);
    this.nextId++;
    return newSubmission;
  }

  async getVerificationSubmission(id: string): Promise<VerificationSubmission | null> {
    return this.verificationSubmissions.find(s => s.id === id) || null;
  }

  async updateVerificationSubmission(id: string, updates: Partial<VerificationSubmission>): Promise<VerificationSubmission> {
    const index = this.verificationSubmissions.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error("Verification submission not found");
    }
    
    this.verificationSubmissions[index] = { ...this.verificationSubmissions[index], ...updates };
    return this.verificationSubmissions[index];
  }

  async listVerificationSubmissions(): Promise<VerificationSubmission[]> {
    return [...this.verificationSubmissions];
  }

  async deleteVerificationSubmission(id: string): Promise<boolean> {
    const index = this.verificationSubmissions.findIndex(s => s.id === id);
    if (index === -1) {
      return false;
    }
    
    this.verificationSubmissions.splice(index, 1);
    return true;
  }

  // Email receiver methods
  async createEmailReceiver(receiver: InsertEmailReceiver): Promise<EmailReceiverList> {
    const newReceiver: EmailReceiverList = {
      id: this.nextEmailId.toString(),
      ...receiver,
      created_at: new Date(),
    };
    this.emailReceivers.push(newReceiver);
    this.nextEmailId++;
    return newReceiver;
  }

  async getEmailReceiver(id: string): Promise<EmailReceiverList | null> {
    return this.emailReceivers.find(r => r.id === id) || null;
  }

  async listEmailReceivers(): Promise<EmailReceiverList[]> {
    return [...this.emailReceivers];
  }

  async deleteEmailReceiver(id: string): Promise<boolean> {
    const index = this.emailReceivers.findIndex(r => r.id === id);
    if (index === -1) {
      return false;
    }
    
    this.emailReceivers.splice(index, 1);
    return true;
  }
}
