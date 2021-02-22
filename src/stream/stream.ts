import * as ApolloRestData from "apollo-datasource-rest";
import { find } from "lodash/fp";
import * as Parsers from "../parsers";

class Stream extends ApolloRestData.RESTDataSource {
  constructor() {
    super();
    // this.baseURL = BOUNCER_API_URL;
  }

  async getStreams(): Promise<any> {
    const res = await this.get(
      "https://www.qa.hh.atg.se/services/racinginfo/v1/api/media/broadcasts"
    );
    console.log({ res });
    return "Testing stream";
  }
  async getMedia(mediaId: string): Promise<any> {
    const res = await this.get(
      `https://www.qa.hh.atg.se/services/racinginfo/v1/api/media/${mediaId}`
    );
    const dataResolved = Parsers.PlatformParser.parse(res);
    const stream = find(
      (item) =>
        item.type === "application/x-mpegURL" || item.type === "video/mp4",
      dataResolved?.streams || []
    );

    console.log({ stream });

    return "testing media stream";
  }
}
export default Stream;
