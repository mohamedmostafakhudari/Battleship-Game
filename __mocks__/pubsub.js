const PubSubMock = {
	events: {},
	subscribe: jest.fn(),
	publish: jest.fn(),
	unsubscribe: jest.fn(),
};

export default PubSubMock;
