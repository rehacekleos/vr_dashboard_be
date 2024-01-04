/**
 * Interface for controllers
 */
export interface BaseControllerInterface{
    /**
     * Definition of REST endpoints
     */
    initRouter(): void;
}