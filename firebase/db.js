import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

const CHAR_LIMIT = 50;

export const saveNewProject = async (pixels) => {
  try {
    const pixelsString = JSON.stringify(pixels);
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const projectsColRef = collection(userDocRef, "projects");
    const projectDocRef = await addDoc(projectsColRef, {
      rows: pixels.length,
      cols: pixels[0].length,
    });
    const gridSectionsColRef = collection(projectDocRef, "gridSections");

    let iter = 0;
    for (let i = 0; i < pixels.length; i += CHAR_LIMIT) {
      const sectionDocRef = doc(projectDocRef, "gridSections", iter.toString());
      console.log(pixels.slice(i, Math.min(pixels.length, i + CHAR_LIMIT)));
      await setDoc(sectionDocRef, {
        section: pixels
          .slice(i, Math.min(pixels.length, i + CHAR_LIMIT))
          .reduce((obj, item, index) => {
            obj[index] = item;
            return obj;
          }, {}),
        // section: pixels.slice(i, Math.min(pixels.length, i + CHAR_LIMIT)),
      });
      iter += 1;
    }

    // const docRef = await setDoc(
    //   doc(collection(db, "users", auth.currentUser.uid, "projects")),
    //   {
    //     grid: JSON.stringify(pixels),
    //   }
    // );
    console.log("success");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
