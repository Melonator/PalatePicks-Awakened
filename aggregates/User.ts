export interface UserProps{
  profileId: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImgSrc: string;
  email: string;
  bio: string;
  school: string;
  dateJoined: Date;
}

export class User{
  //TODO: Implement properties of a user like its id, name, profile image, etc.
  public readonly profileId: string;
  public username: string;
  public firstName: string;
  public lastName: string;
  public profileImgSrc: string;
  public email: string;
  public bio: string;
  public school: string;
  public dateJoined: Date;

  constructor(props: UserProps){
    this.profileId = props.profileId;
    this.username = props.username;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.profileImgSrc = props.profileImgSrc;
    this.email = props.email;
    this.bio = props.bio;
    this.school = props.school;
    this.dateJoined = props.dateJoined;
  }


  public validateEmail(email: string): boolean {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  //TODO: Implement the modify user function
  public modifyUser(newData: Partial<UserProps>): void{


    // user business rules
    if(newData.username !== undefined && newData.username.trim() === "") {
      throw new Error("Username cannot be empty.");
    }

    if (newData.bio !== undefined && newData.bio.length > 300) {
      throw new Error("Bio cannot exceed 300 characters.");
    }

    if(newData.email !== undefined && !this.validateEmail(newData.email)){
      throw new Error("Invalid email");
    }

    if(newData.firstName !== undefined && newData.firstName.trim() === "") {
      throw new Error("First name cannot be empty.");
    }

    if(newData.lastName !== undefined && newData.lastName.trim() === "") {
      throw new Error("Last name cannot be empty.");
    }

    if(newData.school !== undefined && newData.school.trim() === "") {
      throw new Error("School cannot be empty.");
    }



    this.username = newData.username ?? this.username;
    this.firstName = newData.firstName ?? this.firstName;
    this.lastName = newData.lastName ?? this.lastName;
    this.profileImgSrc = newData.profileImgSrc ?? this.profileImgSrc;
    this.email = newData.email ?? this.email;
    this.bio = newData.bio ?? this.bio;
    this.school = newData.school ?? this.school;
  }


}
