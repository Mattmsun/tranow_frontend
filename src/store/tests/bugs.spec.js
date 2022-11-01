import {
  addBug,
  bugAdded,
  resolveBug,
  getUnresolvedBugs,
  loadBugs,
  bugsReceived,
} from "../bugs";
import configureStore from "../configureStore";
import { apiCallBegan } from "../api";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
//the unit test is not recomended
// describe("bugSlice", () => {
//   describe("action creators", () => {
//     it("addBug", () => {
//       const bug = { description: "a" };
//       const result = addBug(bug);
//       const expected = {
//         type: apiCallBegan.type,
//         payload: {
//           url: "/bugs",
//           method: "post",
//           data: bug,
//           onSuccess: bugAdded.type,
//         },
//       };
//       expect(result).toEqual(expected);
//     });
//   });
// });

describe("bugsSlice", () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });
  const bugsSlice = () => store.getState().entities.bugs;
  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });
  describe("addBug", () => {
    it("should add the bug to the store if it's saved to the server", async () => {
      //Arrange
      const bug = { description: "a" };
      const savedBug = { ...bug, id: 1 };
      fakeAxios.onPost("/bugs").reply(200, savedBug);

      //Act
      await store.dispatch(addBug(bug));
      // console.log(store.getState());
      //Assert
      expect(bugsSlice().list).toContainEqual(savedBug);
    });

    it("should not add the bug to the store if it's not saved to the server", async () => {
      //Arrange
      const bug = { description: "a" };
      fakeAxios.onPost("/bugs").reply(500);

      //Act
      await store.dispatch(addBug(bug));
      // console.log(store.getState());
      //Assert
      expect(bugsSlice().list).toHaveLength(0);
    });
  });

  describe("selecors", () => {
    it("getUnresolvedBugs", () => {
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, resolved: true },
        { id: 2 },
        { id: 3 },
      ];

      const result = getUnresolvedBugs(state);

      expect(result).toEqual([{ id: 2 }, { id: 3 }]);
    });
  });
  describe("resolveBug", () => {
    it("should mark the bug as resolved if it's saved to the server", async () => {
      const updatedBug = { id: 1, resolved: true };
      fakeAxios.onPatch(`/bugs/1`).reply(200, updatedBug);
      fakeAxios.onPost("/bugs").reply(200, { id: 1 });

      await store.dispatch(addBug({}));
      await store.dispatch(resolveBug(1));

      expect(bugsSlice().list[0].resolved).toBe(true);
    });

    it("should not mark the bug as resolved if it's not saved to the server", async () => {
      const updatedBug = { id: 1, resolved: true };
      fakeAxios.onPost("/bugs").reply(200, { id: 1 });
      fakeAxios.onPatch(`/bugs/1`).reply(500);

      await store.dispatch(addBug({}));
      await store.dispatch(resolveBug(1));

      expect(bugsSlice().list[0].resolved).not.toBe(true);
    });
  });

  describe("loadBugs", () => {
    describe("if the bugs exist in the cache", () => {
      it("should not be fetched from the server again", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        expect(fakeAxios.history.get.length).toBe(1);
      });
    });

    describe("if the bugs don't exist in the cache", () => {
      it("should  be fetched from the server", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());

        expect(bugsSlice().list).toHaveLength(1);
      });

      describe("loading indicator", () => {
        it("should be true while fetching the bugs", () => {
          fakeAxios.onGet("/bugs").reply(() => {
            expect(bugsSlice().loading).toBe(true);

            [200, [{ id: 1 }]];
          });
          store.dispatch(loadBugs());
        });
        it("should be false after fetching the bugs", async () => {
          fakeAxios.onGet("/bugs").reply(() => {
            [200, [{ id: 1 }]];
          });
          await store.dispatch(loadBugs());
          expect(bugsSlice().loading).toBe(false);
        });

        it("should be true if there was an error", async () => {
          fakeAxios.onGet("/bugs").reply(500);
          await store.dispatch(loadBugs());
          expect(bugsSlice().loading).toBe(false);
        });
      });
    });

    // it("should save the bugs to store if data was fetched from server", async () => {
    //   const bugs = [{ id: 1 }, { id: 2 }, { id: 3 }];
    //   fakeAxios.onGet("/bugs").reply(200, { bugs });

    //   await store.dispatch(
    //     loadBugs({ url: "/bugs", onSuccess: bugsReceived.type })
    //   );
    //   expect(bugsSlice().list).toContainEqual(bugs);
    // });
  });
});
