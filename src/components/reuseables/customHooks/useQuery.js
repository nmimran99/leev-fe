
import { queryParamsToObject } from '../../../api/genericApi'

export const useQuery = (searchLocation) => {
    return queryParamsToObject(searchLocation);
}