const { SlashCommandBuilder } = require('@discordjs/builders');
const devId = process.env.PTV_DEV_ID;
const apiKey = process.env.PTV_DEV_KEY;
const ptvFormatter = require('../functions/PTVFormatter');

let ptv = new ptvFormatter(devId, apiKey);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('next')
		.setDescription('Shows the next 3 departures per direction from a station.')
		.addStringOption(option =>
			option.setName('station')
				.setDescription('The station you want departures for.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('route_type')
				.setDescription('The type of transport')
				.addChoice('Metro', '0')
				.addChoice('Tram', '1')
				.addChoice('Bus', '2')
				.addChoice('Vline', '3')
				.addChoice('Night Bus', '4'))
		.addStringOption(option =>
			option.setName('minutes')
				.setDescription('How many minutes ahead do you want to look? (COMING SOON)')),
				
	async execute(interaction) {
		await interaction.deferReply();

		stops = await ptv.searchToMenu(interaction.options.getString('station'), ((interaction.options.getString('route_type') == null) ? [0,1,2,3,4] : [interaction.options.getString('route_type')])); //todo: add route_type options

		await interaction.editReply({content: 'Which station would you like?', components: [stops]});
	},

	async updateDepartures(interaction) {
		await interaction.deferUpdate();
		
		departures = await ptv.stopToDeparturesEmbed(interaction.values[0].substring(1), interaction.values[0][0])

		await interaction.editReply(departures)
	}

};
