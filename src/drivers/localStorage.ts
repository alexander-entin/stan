export type Config = {
	$stan: object,
	paths?: string | string[] | string[][],
	$config?: Config,
}

export function sync(key: string, { $stan, $config, paths }: Partial<Config>) {

}