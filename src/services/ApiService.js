

export default class ApiService{

   async getResource(url){
         const res = await fetch('https://api.themoviedb.org/3/search/movie?api_key=46add38fb96bd13ada573d1cccde3edf&language=en-US&query=road&page=1&include_adult=false');

         if(!res.ok){
            throw new Error("Could not fetch")
         }

         return await res.json();
   }


}

