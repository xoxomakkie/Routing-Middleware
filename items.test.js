const request = require('supertest');
const app = require('./app');

describe('Shopping List API', () => {
    beforeEach(() => {
        // Clear the items array before each test
        global.items.length = 0;
    });

    describe('GET /items', () => {
        test('should return empty array initially', async () => {
            const response = await request(app).get('/items');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        test('should return array of items', async () => {
            // Add some test data
            global.items.push(
                { name: 'popsicle', price: 1.45 },
                { name: 'cheerios', price: 3.40 }
            );

            const response = await request(app).get('/items');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { name: 'popsicle', price: 1.45 },
                { name: 'cheerios', price: 3.40 }
            ]);
        });
    });

    describe('POST /items', () => {
        test('should add a new item', async () => {
            const newItem = { name: 'popsicle', price: 1.45 };
            
            const response = await request(app)
                .post('/items')
                .send(newItem)
                .expect(201);

            expect(response.body).toEqual({ added: newItem });
            expect(global.items).toContainEqual(newItem);
        });

        test('should return 400 if name is missing', async () => {
            const response = await request(app)
                .post('/items')
                .send({ price: 1.45 })
                .expect(400);

            expect(response.body).toEqual({ error: "Name and price are required" });
        });

        test('should return 400 if price is missing', async () => {
            const response = await request(app)
                .post('/items')
                .send({ name: 'popsicle' })
                .expect(400);

            expect(response.body).toEqual({ error: "Name and price are required" });
        });
    });

    describe('GET /items/:name', () => {
        test('should return a specific item', async () => {
            global.items.push({ name: 'popsicle', price: 1.45 });

            const response = await request(app)
                .get('/items/popsicle')
                .expect(200);

            expect(response.body).toEqual({ name: 'popsicle', price: 1.45 });
        });

        test('should return 404 if item not found', async () => {
            const response = await request(app)
                .get('/items/nonexistent')
                .expect(404);

            expect(response.body).toEqual({ error: "Item not found" });
        });
    });

    describe('PATCH /items/:name', () => {
        test('should update an existing item', async () => {
            global.items.push({ name: 'popsicle', price: 1.45 });

            const updatedData = { name: 'new popsicle', price: 2.45 };
            
            const response = await request(app)
                .patch('/items/popsicle')
                .send(updatedData)
                .expect(200);

            expect(response.body).toEqual({ updated: updatedData });
            expect(global.items[0]).toEqual(updatedData);
        });

        test('should update only name if price not provided', async () => {
            global.items.push({ name: 'popsicle', price: 1.45 });

            const response = await request(app)
                .patch('/items/popsicle')
                .send({ name: 'new popsicle' })
                .expect(200);

            expect(response.body).toEqual({ 
                updated: { name: 'new popsicle', price: 1.45 }
            });
        });

        test('should update only price if name not provided', async () => {
            global.items.push({ name: 'popsicle', price: 1.45 });

            const response = await request(app)
                .patch('/items/popsicle')
                .send({ price: 2.99 })
                .expect(200);

            expect(response.body).toEqual({ 
                updated: { name: 'popsicle', price: 2.99 }
            });
        });

        test('should return 404 if item not found', async () => {
            const response = await request(app)
                .patch('/items/nonexistent')
                .send({ name: 'new name', price: 2.45 })
                .expect(404);

            expect(response.body).toEqual({ error: "Item not found" });
        });
    });

    describe('DELETE /items/:name', () => {
        test('should delete an existing item', async () => {
            global.items.push(
                { name: 'popsicle', price: 1.45 },
                { name: 'cheerios', price: 3.40 }
            );

            const response = await request(app)
                .delete('/items/popsicle')
                .expect(200);

            expect(response.body).toEqual({ message: "Deleted" });
            expect(global.items).toEqual([{ name: 'cheerios', price: 3.40 }]);
        });

        test('should return 404 if item not found', async () => {
            const response = await request(app)
                .delete('/items/nonexistent')
                .expect(404);

            expect(response.body).toEqual({ error: "Item not found" });
        });
    });
});
