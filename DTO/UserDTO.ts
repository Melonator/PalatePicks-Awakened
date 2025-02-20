/*
* Unlike a user aggregate, this only enables read-only operations
* to display the data of a user
* */

export interface UserDTO{
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
