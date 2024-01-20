export class Member {
    mail: string = '';
    firstName: string = ''
    userName: string = '';
    image: string = '';
  }
  

export class Group {
    groupId: number = 0;
    name: string = '';
    description: string = '';
    imageUrl: string = '';
    imageFile: File = null;
    members: Member[]
  }