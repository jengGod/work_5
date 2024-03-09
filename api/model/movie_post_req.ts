export interface mvReq {
    movie_id:      number;
    movie_name:    string;
    movie_picture: string;
    movie_rating:  string;
    movie_vdo:     string;
    movie_detail:  string;
    movie_time:    string;
}

 interface Movie {
    movie_id:      number;
    movie_name:    string;
    movie_picture: string;
    movie_rating:  string;
    movie_vdo:     string;
    movie_detail:  string;
    movie_time:    string;
}

  interface Star {
    star_id: number;
    person_id: number;
    role: string;
  }
 interface Person {
    star_id: number;
    person_id: number;
    role: string;
  }
  
  
interface Creators {
    creator_id: number;
    person_id: number;
    type: string;
  }
  
//   export interface MovieDetails extends mvReq {
//      stars: Star[];
//      creators: Creator[];
//    }