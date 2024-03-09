export interface personReq {
    person_id:      number;
    person_name:    string;
    person_picture: string;
    person_age:     string;
    person_info:    string;
}
export interface starReq {
    star_id:   number;
    movie_id:  number;
    person_id: number;
    role:      string;
}
export interface creatorReq {
    creator_id: number;
    movie_id:   number;
    person_id:  number;
    type:       string;
}