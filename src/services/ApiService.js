

export default class ApiService{

   async getResource(nameMovie='Better'){
         const url = `https://api.themoviedb.org/3/search/movie?api_key=46add38fb96bd13ada573d1cccde3edf&language=en-US&query=${nameMovie}&page=1&include_adult=false`;

         const res = await fetch(url);
         
         if(!res.ok){
            throw new Error(`Could not fetch ${url} received ${res.status}`);
         }
         const dataOfMovies = await res.json();
         
        
         if(dataOfMovies.results.length === 0){
            throw new Error(`Could not fetch ${url} received 404`);
         }
         return dataOfMovies
   }


}

