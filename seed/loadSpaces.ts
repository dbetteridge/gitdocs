const spaces = [
  "google.com",
  "microsoft.com",
  "apple.com",
  "adobe.com",
  "cloudflare.com",
];

import { addSpace } from "../controllers/Spaces";

spaces.map((space, index) => {
  if (index < 3) {
    addSpace(space, "danielrbetteridge@gmail.com");
  } else {
    addSpace(space, "test@test.com");
  }
});
