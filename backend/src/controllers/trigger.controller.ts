import { getRecentTriggerEvents, runTriggerCycle, getAllZones } from '../triggers';
import { addZone } from '../triggers/zoneRepository';

export class TriggerController {
  
  getEvents = async (req: any, res: any) => {
    try {
      const { type, zone, limit, includeMock } = req.query;
      const events = await getRecentTriggerEvents(
        Number(limit) || 50,
        type as string,
        zone as string,
        includeMock === 'true'
      );
      res.json({ events, count: events.length });
    } catch (err: any) {
      console.error('Error fetching trigger events:', err);
      res.status(500).json({ message: 'Failed to fetch trigger events' });
    }
  };

  getZones = async (_req: any, res: any) => {
    try {
      const zones = await getAllZones();
      res.json({ zones });
    } catch (err: any) {
      console.error('Error fetching monitored zones:', err);
      res.status(500).json({ message: 'Failed to fetch monitored zones' });
    }
  };

  addZone = async (req: any, res: any) => {
    try {
      const { name, city, lat, lon, accuWeatherKey } = req.body;
      if (!name || !city || typeof lat !== 'number' || typeof lon !== 'number') {
        return res.status(400).json({ message: 'Missing required zone fields (name, city, lat, lon)' });
      }
      const newZone = await addZone({ name, city, lat, lon, accuWeatherKey });
      res.status(201).json({ zone: newZone });
    } catch (err: any) {
      console.error('Error adding new zone:', err);
      res.status(500).json({ message: 'Failed to register new zone' });
    }
  };

  poll = async (_req: any, res: any) => {
    try {
      const pollResults = await runTriggerCycle();
      res.json({
        message: 'Trigger cycle executed successfully',
        results: pollResults,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Manual trigger cycle failed:', err);
      res.status(500).json({ message: 'Manual trigger cycle failed. Please check logs.' });
    }
  };
}
