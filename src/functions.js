// function afficherCours
export async function afficherCours() {
  try {
    const response = await fetch(new URL("./courses.json", import.meta.url));

    if (!response.ok) {
      throw new Error("Impossible de charger les cours");
    }

    const courses = await response.json();
    const container = document.querySelector(".cards");

    container.innerHTML = "";

    courses.forEach((course) => {
      const card = document.createElement("div");

      card.className =
        "w-full space-y-3 rounded-2xl border border-[#E6F0E9] bg-white p-4 shadow-sm";

      card.innerHTML = `
        <main class="flex items-start gap-3">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E6F0E9] text-[#174A3A]"
          >
            <i class="fa-solid fa-${course.icon} text-2xl" aria-hidden="true"></i>
          </div>

          <div>
            <h2 class="text-lg font-bold text-[#174A3A]">
              ${course.title}
            </h2>

            <p class="text-sm text-[#65716A]">
              ${course.level}
            </p>

            <p class="mt-1 text-xs text-[#65716A]">
              ${course.duration}
            </p>
          </div>
        </main>

        <p class="text-sm text-[#65716A]">
          ${course.description}
        </p>

        <p class="text-sm text-[#1D2924]">
          <strong class="text-[#174A3A]">${course.price} DH</strong> / mois
        </p>

        <a
          href="#"
          class="block text-right text-sm text-[#174A3A] underline"
        >
          Voir les détails
        </a>

        <button
          type="button"
          class="w-full rounded-xl bg-[#174A3A] p-2 text-sm font-medium text-white hover:bg-[#10372C]"
        >
          Ajouter au panier +
        </button>
      `;

      container.append(card);
    });
  } catch (error) {
    console.error("Erreur :", error);
  }
}
