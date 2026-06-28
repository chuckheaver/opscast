// The old standalone listings/market browser has been retired — its market
// data now lives on MySFMap as the "Homes" overlay and "Stats" pop-up. This
// route redirects there so existing links (entry tile, pop-ups, field scripts)
// keep working.
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/fog?preset=homes");
}
