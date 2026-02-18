export interface Post {
  ID?: number & { __brand: 'unique' };
  postName: string;
  contactPerson: string;
  phoneNum?: string;
  gstin: string;
  pan: string;
  address: string;
  status: Status;
  contractDate: string;
}

export enum Status {
  active = 'Active',
  inactive = 'Inactive',
}

export interface PostDocuments {
  ID?: number & { __brand: 'unique' };
  postName?: string;
  docGst?: string | File;
  docPan?: string | File;
  docContract?: string | File;
  docOther?: string | File;
}
