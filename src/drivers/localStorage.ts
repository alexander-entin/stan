export type Config = {
	key: string,
	$stan: object,
	$sync: Config,
	paths: string | string[] | string[][],
}

export function sync({ key, $stan, $sync, paths }: Partial<Config>) {

}