package LHM;

import java.rmi.Remote;
import java.rmi.RemoteException;

// Interface No.2 (History) extending Remote Class for RMI functionality
public interface History extends Remote {
    
    // Method to get description, with RemoteException handling for RMI
    String getDescription() throws RemoteException;

   // New method to get gender using the Gender enum
    Gender getGender() throws RemoteException;
	
	/**
     * Enum representing gender.
     * This enum is serializable, allowing it to be used in RMI communication.
     */
    enum Gender implements Serializable {
        MALE, FEMALE, OTHER
    }
}
