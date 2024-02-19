import config from '@config';
import { Channel } from '@find-care/models';
import { constructFindCareRequest } from '@services';

// change payload to param you would like to pass in API call, or remove if no param needed
export const getB2bservice = (payload: any) =>
  constructFindCareRequest
    // add your API endpoint here
    .get(config.api.memberProfileEndpoint, {
      params: {
        consumerCode: config.consumerCode,
        channel: Channel.Mobile,
        ...payload,
        // add any additional params here
      },
    })
    .then(({ data }) => data);
